package br.com.projeto.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import br.com.projeto.model.Categoria;
import br.com.projeto.model.Transacao;
import br.com.projeto.model.enums.TipoTransacao;
import br.com.projeto.repository.CategoriaRepository;
import br.com.projeto.repository.TransacaoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final CategoriaRepository categoriaRepository;
    private final TransacaoRepository transacaoRepository;

    public DataLoader(CategoriaRepository categoriaRepository, TransacaoRepository transacaoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.transacaoRepository = transacaoRepository;
    }

    @Override
    public void run(String... args) {
        if (categoriaRepository.count() > 0) {
            return;
        }

        Categoria salario = categoriaRepository.save(new Categoria("Salário"));
        Categoria alimentacao = categoriaRepository.save(new Categoria("Alimentação"));
        Categoria transporte = categoriaRepository.save(new Categoria("Transporte"));
        Categoria moradia = categoriaRepository.save(new Categoria("Moradia"));
        categoriaRepository.save(new Categoria("Lazer"));
        categoriaRepository.save(new Categoria("Outros"));

        if (transacaoRepository.count() == 0) {
            Transacao t1 = new Transacao();
            t1.setDescricao("Salário mensal");
            t1.setValor(new BigDecimal("3500.00"));
            t1.setData(LocalDate.now().minusDays(5));
            t1.setTipo(TipoTransacao.RECEITA);
            t1.setCategoria(salario);
            t1.setObservacao("Pagamento referente ao mês");

            Transacao t2 = new Transacao();
            t2.setDescricao("Supermercado");
            t2.setValor(new BigDecimal("420.50"));
            t2.setData(LocalDate.now().minusDays(3));
            t2.setTipo(TipoTransacao.DESPESA);
            t2.setCategoria(alimentacao);
            t2.setObservacao("Compras da semana");

            Transacao t3 = new Transacao();
            t3.setDescricao("Aluguel");
            t3.setValor(new BigDecimal("1100.00"));
            t3.setData(LocalDate.now().minusDays(2));
            t3.setTipo(TipoTransacao.DESPESA);
            t3.setCategoria(moradia);

            Transacao t4 = new Transacao();
            t4.setDescricao("Combustível");
            t4.setValor(new BigDecimal("180.00"));
            t4.setData(LocalDate.now().minusDays(1));
            t4.setTipo(TipoTransacao.DESPESA);
            t4.setCategoria(transporte);

            transacaoRepository.saveAll(List.of(t1, t2, t3, t4));
        }
    }
}
